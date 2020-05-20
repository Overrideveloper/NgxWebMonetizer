export function INJECT_META_TAG(value: string) {
    const tag: HTMLMetaElement = document.createElement('meta');
    tag.content = value;
    tag.name = 'monetization'

    const head: HTMLHeadElement = document.getElementsByTagName('head')[0];

    const doesTagExist = Array.from(head.children).findIndex(el => el instanceof HTMLMetaElement && el.name === 'monetization' && el.content === value) > -1;
    const monetizationTags = Array.from(head.children).filter(el => el instanceof HTMLMetaElement && el.name === 'monetization' && el.content !== value);

    monetizationTags.map(el => head.removeChild(el));

    if (!doesTagExist) {
        head.appendChild(tag);
    }
}

export function REMOVE_META_TAG() {
    const head: HTMLHeadElement = document.getElementsByTagName('head')[0];
    const monetizationTags = Array.from(head.children).filter(el => el instanceof HTMLMetaElement && el.name === 'monetization');
    monetizationTags.map(el => head.removeChild(el));
}

export function BROWSER_UNSUPPORTED_WARNING() {
    console.warn('Your browser does not support Web Monetization. See https://webmonetization.org/docs/explainer#browsers to learn how to enable Web Monetization on your browser');
}