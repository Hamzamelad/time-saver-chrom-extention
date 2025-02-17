const imageIds = ['camping']

// get index.html content and return it as text.
const getHtml = async () => {
    const res =  fetch(chrome.runtime.getURL('index.html'))
    return (await res).text()
}

// get style.css content and return it as text.
const getCss = async () => {
    const res =  fetch(chrome.runtime.getURL('style.css'))
    return (await res).text()
}

// add src attribute with valide url to images that match one of imageIds.
const setImagesSrc = () => {
    for (const id of imageIds) {
        const img = document.getElementById(id)
        img.src = chrome.runtime.getURL(`${id}.jpg`)
        if (img.src) {
            img.src = chrome.runtime.getURL(`${id}.jpg`)
        }
    }
}

const getDomains = async () => {
    const data = await chrome.storage.sync.get("domains")
    return data.domains || []
}

const isBlocked = async (domain) => {
    const blockAll = await chrome.storage.sync.get('blockAll').then((data) => data.blockAll)
    const domains = await getDomains()

    console.log(blockAll, domains.includes(domain))


    if (blockAll) {
        if (domains.includes(domain)) return false
        return true
    } else {
        if (!domains.includes(domain)) return false
        return true
    }
}

// update the DOM with new Html anc css
const updateDom = async () => {
    const currentDomain = window.location.hostname

    const blocked = await isBlocked(currentDomain)
    console.log(blocked, currentDomain)

    if (!blocked) return

    const html = await getHtml()
    const css = await getCss()

    document.documentElement.innerHTML = html

    const style = document.getElementsByTagName('style')[0]
    style.textContent = css
    
    setImagesSrc()
}

updateDom()

