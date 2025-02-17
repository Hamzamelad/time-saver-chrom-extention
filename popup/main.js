// Tracked DOM elements 
const form = document.getElementById('add-form');
const ul = document.getElementById('domains-list')
const toggle = document.getElementById('toggle')

const  loadDomains = async () =>  {
    const data = await getDomains()
    renderList(data)
}

const setDomains = async (value) => {
    const oldValue = await getDomains()
    const newValue = [value, ...oldValue]
    const uniqueArray = newValue.filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
    await chrome.storage.sync.set({domains: uniqueArray})
}

const getDomains = async () => {
    const data = await chrome.storage.sync.get("domains")
    return data.domains || []
}

const removeDomain = async (domain) => {
    const oldValue = await getDomains()
    const newValue =  oldValue.filter((el) => el !== domain)
    await chrome.storage.sync.set({domains: newValue})
}

const handleAdd = () => {
    const form = document.createElement('form')

}

const generateLi = (domain) => `
    <li >
        ${domain}
        <button class="remove-btn icon" data-domain="${domain}">
            <img class="sm" src="remove.png" alt="remove"/>
        </button> 
    </li>
`

const renderList = (domains) => {
    let lis = '';
    if (!typeof domains === Array) return
   [...domains].forEach(domain => {
        lis = lis + generateLi(domain)
    });

    ul.innerHTML = lis
}

ul.addEventListener('click', (e) => {
    const button = e.target.closest('.remove-btn');
    if (button) {
        // Get the data-domain from the button
        const domain = button.dataset.domain;
        removeDomain(domain);
    }
});


form.addEventListener('submit',async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    // Capture form data
    const formData = new FormData(form);
    const domain = formData.get('domain')

    if (domain) {
        await setDomains(domain)
        const data = await getDomains()
    }
    form.reset();
});

chrome.storage.sync.get('blockAll').then((data) => {
    toggle.checked = data.blockAll
})

toggle.addEventListener('change',async (e) => {
    await chrome.storage.sync.set({blockAll: e.target.checked})
})

chrome.storage.onChanged.addListener((changes) => {
    renderList(changes.domains.newValue)
});

loadDomains();