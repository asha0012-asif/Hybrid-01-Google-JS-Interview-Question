const APP = {
    CACHE_NAME: "cache-image-v1",
    BASE_URL: "https://picsum.photos/v2/list",

    init: () => {
        APP.fetchAndCacheImage();
        APP.getImage();
    },
    
    fetchAndCacheImage: async () => {
        console.log("Fetching Image and Caching.");
        
        try {
            const response = await fetch(APP.BASE_URL);
            // console.log(response);

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const images = await response.json();
            // console.log(images);

            const cache = await caches.open(APP.CACHE_NAME);

            const headers = {
                mode: "cors"
            }

            for (const image of images) {

                const imageResponse = new Response({
                    headers,
                });

                cache.put(image.download_url, imageResponse);
            }

        } catch (err) {
            console.warn("There was an error in fetching images:", err);
        }
    },

    getImage: async () => {
        console.log("Fetching Image and Caching.");

        
        try {
            const cache = await caches.open(APP.CACHE_NAME); 
            const keys = await cache.keys();
            // console.log(keys);
            
            if (keys.length > 0) {
                console.log("Images were found in cache.");
                
                let results = document.getElementById("results");
                let df = new DocumentFragment;

                keys.forEach(async (key) => {
                    if (cache.match(key)) {
                        console.log("URL found in cache:", key.url);

                        try {
                            const response = await fetch(key.url);
                            // console.log(response);

                            if (!response.ok) {
                                throw new Error();
                            }

                            const blob = await response.blob();
                            const blobURL = URL.createObjectURL(blob);

                            const img = document.createElement("img");
                            img.src = blobURL;
                            img.alt = "";

                            img.style.width = "100%";
                            img.style.aspectRatio = "5 / 3";

                            df.append(img);

                        } catch (err) {
                            console.warn(err);
                        } finally {
                            results.append(df);
                        }
                    }
                });

            } else {
                fetchAndCacheImage();
            }

        } catch (err) {
            console.warn("There was an error getting images from cache:", err);
        }

    }

}

window.addEventListener("DOMContentLoaded", APP.init);