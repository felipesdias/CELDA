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
    },
    errorMsg (field, item) {
        if (!item.$error) return ''
        if (item.required !== undefined && !item.required) return `${field} é obrigatório`
        if (item.minLength !== undefined && !item.minLength) return `${field} deve ter no mínimo ${item.$params.minLength.min} caracteres`
        if (item.maxLength !== undefined && !item.maxLength) return `must not be more than ${item.$params.maxLength.max} characters long`
        if (item.maxValue !== undefined && !item.maxValue) return `${field} deve ser menor que ${item.$params.maxValue.max}`
        return `${field} é inválido`;
    }
}

export default ({ Vue }) => {
    Vue.prototype.$utils = utils;
}

export { utils };
