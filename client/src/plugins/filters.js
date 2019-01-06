import moment from 'moment';

// leave the export, even if you don't use it
const formatDate = (date, format) => {
    if (!date) return '-';

    const dateF = moment(new Date(date));

    switch (format) {
    case 'TIME':
        return dateF.format('HH:mm');
    case 'DATE':
        return dateF.format('DD/MM/YYYY');
    case 'DATETIME':
        return dateF.format('DD/MM/YYYY - HH:mm');
    default:
        return dateF.format(format);
    }
};

const concatList = (list, sep, field = null) => {
    if (!Array.isArray(list) || list.length === 0) return '';

    if (field) return list.map(item => item[field]).join(sep);

    return list.join(sep);
}

export default ({ Vue }) => {
    Vue.filter('formatDate', formatDate);

    Vue.filter('concatList', concatList);
};
