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
        console.log(img,id)
        if (img.src) {
            img.src = chrome.runtime.getURL(`${id}.jpg`)
        }
    }
}

// update the DOM with new Html anc css
const updateDom = async () => {
    const html = await getHtml()
    const css = await getCss()

    document.documentElement.innerHTML = html

    const style = document.getElementsByTagName('style')[0]
    style.textContent = css
    
    setImagesSrc()
}

updateDom()
