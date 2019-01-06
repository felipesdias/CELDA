const utils = {
    downloadResponse(response, name = 'unknown', extension = '') {
        const blob = new Blob([response.data], {type: response.data.type});
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const contentDisposition = response.headers['content-disposition'];
        let fileName = `${name}${extension}`;
        if (contentDisposition) {
            fileName = (contentDisposition.split('filename=')[1] || '').trim() || 'unknown'
        }
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
}

export default ({ Vue }) => {
    Vue.prototype.$utils = utils;
}

export { utils };
