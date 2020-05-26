export function INJECT_META_TAG(value: string) {
    const tag: HTMLMetaElement = document.createElement('meta');
    tag.content = value;
    tag.name = 'monetization'

    const head: HTMLHeadElement = document.getElementsByTagName('head')[0];
    const monetizationTags: HTMLMetaElement[] = Array.from(document.querySelectorAll('meta[name="monetization"]'));

    let doesTagExist = false;

    for (let monetizationTag of monetizationTags) {
        if (monetizationTag.content !== value) {
            monetizationTag.remove();
        } else {
            doesTagExist = true;
        }
    }

    if (!doesTagExist) {
        head.appendChild(tag);
    }
}

export function REMOVE_META_TAG() {
    const tag = <HTMLMetaElement> document.querySelector('meta[name="monetization"]');

    if (tag) {
        tag.remove();
    }
}

export function BROWSER_UNSUPPORTED_WARNING() {
    console.warn('Your browser does not support Web Monetization. See https://webmonetization.org/docs/explainer#browsers to learn how to enable Web Monetization on your browser');
}