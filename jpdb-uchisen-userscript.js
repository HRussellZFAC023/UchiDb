// ==UserScript==
// @name         JPDB Uchisen Image Inserter
// @version      1.0
// @description  Inserts Uchisen mnemonic images into JPDB kanji cards
// @author       togeffet, Henry Russell
// @match        https://jpdb.io/kanji/*
// @match        https://jpdb.io/review*
// @connect      uchisen.com
// @connect      ik.imagekit.io
// @connect      dhblqbsgkimuk.cloudfront.net
// @grant        GM_xmlhttpRequest
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    let currentKanji = '';

    function extractKanjiFromURL() {
        const url = window.location.href;
        
        // For kanji pages like https://jpdb.io/kanji/犬
        const kanjiMatch = url.match(/https:\/\/jpdb\.io\/kanji\/(.+?)(?:[?#]|$)/);
        if (kanjiMatch) {
            // Remove any URL parameters and decode
            const kanjiPart = kanjiMatch[1].split('?')[0].split('#')[0];
            return decodeURIComponent(kanjiPart);
        }
        
        // For review pages
        const hiddenInput = document.querySelector('input[name="c"]');
        if (hiddenInput) {
            const parts = hiddenInput.value.split(',');
            if (parts.length > 1 && parts[0] === 'kb') {
                return parts[1];
            }
        }
        
        return '';
    }

    function fetchUchisenImage(kanji) {
        const url = `https://uchisen.com/kanji/${encodeURIComponent(kanji)}`;
        
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    parseAndInsertImage(response.responseText, kanji);
                } else {
                    console.log(`Failed to fetch Uchisen page for ${kanji}`);
                }
            },
            onerror: function(error) {
                console.error('Error fetching Uchisen page:', error);
            }
        });
    }

    function parseAndInsertImage(html, kanji) {
        // Create a temporary DOM element to parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Find the kanji image loader container with data-large attribute
        const imageLoader = doc.querySelector('.kanji_image_loader[data-large]');
        if (!imageLoader) {
            console.log(`No image found for kanji: ${kanji}`);
            return;
        }
        
        const imageUrl = imageLoader.getAttribute('data-large');
        const story = doc.querySelector('#mnemonic_story')?.textContent || 'No story available';
        
        insertImageIntoJPDB(imageUrl, story, kanji);
    }

    function insertImageIntoJPDB(imageUrl, story, kanji) {
        // Find the mnemonic div in JPDB
        const mnemonicDivs = document.querySelectorAll('.subsection');
        let mnemonicDiv = null;
        
        // Look for the div that contains mnemonic content or is next to "Mnemonic" label
        const mnemonicLabels = document.querySelectorAll('h6.subsection-label');
        for (const label of mnemonicLabels) {
            if (label.textContent.includes('Mnemonic')) {
                mnemonicDiv = label.nextElementSibling;
                break;
            }
        }
        
        // If no specific mnemonic div found, try to find a good insertion point
        if (!mnemonicDiv) {
            const keywordDiv = document.querySelector('.subsection');
            if (keywordDiv) {
                mnemonicDiv = keywordDiv.parentNode;
            }
        }
        
        if (!mnemonicDiv) {
            console.log('Could not find suitable insertion point for mnemonic');
            return;
        }
        
        // Check if we already inserted an image to avoid duplicates
        if (document.getElementById('uchisen-mnemonic-container')) {
            return;
        }
        
        // Create the container for our mnemonic content
        const container = document.createElement('div');
        container.id = 'uchisen-mnemonic-container';
        container.style.cssText = `
            margin: 20px 0;
            padding: 0;
            text-align: center;
        `;
        
        // Add the image
        const img = document.createElement('img');
        img.alt = `Uchisen mnemonic for ${kanji}`;
        img.style.cssText = `
            max-width: 300px;
            max-height: 300px;
            border-radius: 4px;
            margin-bottom: 10px;
            border: 1px solid var(--table-border-color);
        `;

        // Fetch image as a blob to bypass potential CSP issues
        GM_xmlhttpRequest({
            method: 'GET',
            url: imageUrl,
            responseType: 'blob',
            onload: function(response) {
                const blobUrl = URL.createObjectURL(response.response);
                img.src = blobUrl;
            },
            onerror: function(error) {
                console.error('Error fetching Uchisen image:', error);
                img.alt = `Failed to load image for ${kanji}`;
            }
        });
        
        // Add the story
        const storyDiv = document.createElement('div');
        storyDiv.textContent = story;
        storyDiv.style.cssText = `
            font-size: 14px;
            color: var(--text-color);
            line-height: 1.4;
            max-width: 400px;
            margin: 0 auto 10px auto;
        `;
        
        // Add link to Uchisen
        const link = document.createElement('a');
        link.href = `https://uchisen.com/kanji/${encodeURIComponent(kanji)}`;
        link.target = '_blank';
        link.textContent = 'View on Uchisen';
        link.style.cssText = `
            display: inline-block;
            color: var(--link-color);
            text-decoration: none;
            font-size: 12px;
        `;
        
        container.appendChild(img);
        container.appendChild(storyDiv);
        container.appendChild(link);
        
        // Insert the container
        if (mnemonicDiv.tagName === 'DIV' && mnemonicDiv.classList.contains('subsection')) {
            // Insert after the subsection
            mnemonicDiv.parentNode.insertBefore(container, mnemonicDiv.nextSibling);
        } else {
            // Insert as child
            mnemonicDiv.appendChild(container);
        }
    }

    function init() {
        const kanji = extractKanjiFromURL();
        if (kanji) {
            currentKanji = kanji;
            console.log(`Found kanji: ${kanji}`);
            fetchUchisenImage(kanji);
        }
    }

    // Run on page load
    init();
    
    // Observer for URL changes (for review pages)
    const observer = new MutationObserver(() => {
        if (window.location.href !== observer.lastUrl) {
            observer.lastUrl = window.location.href;
            setTimeout(init, 500); // Small delay to let content load
        }
    });
    
    observer.lastUrl = window.location.href;
    observer.observe(document, { subtree: true, childList: true });

})();