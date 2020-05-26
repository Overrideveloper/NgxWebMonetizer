export function INJECT_META_TAG(value: string) {
    const tag: HTMLMetaElement = document.createElement('meta');
    tag.content = value;
    tag.name = 'monetization'

    const head: HTMLHeadElement = document.getElementsByTagName('head')[0];
    const monetizationTags: HTMLMetaElement[] = Array.from(document.querySelectorAll('meta[name="monetization"]'));

    let doesTagExist = false;

    monetizationTags.map(tag => {
        if (tag.content !== value) {
            head.removeChild(tag);
        } else {
            doesTagExist = true;
        }
    });

    if (!doesTagExist) {
        head.appendChild(tag);
    }
}

export function REMOVE_META_TAG() {
    const head: HTMLHeadElement = document.getElementsByTagName('head')[0];
    const monetizationTags: HTMLMetaElement[] = Array.from(document.querySelectorAll('meta[name="monetization"]'));

    monetizationTags.map(el => head.removeChild(el));
}

export function BROWSER_UNSUPPORTED_WARNING() {
    console.warn('Your browser does not support Web Monetization. See https://webmonetization.org/docs/explainer#browsers to learn how to enable Web Monetization on your browser');
}