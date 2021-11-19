
const getMissingFields = (requiredFields, fields) => {
    return requiredFields.filter(field => {
        if (!fields[field]) return field;
    });
}

const getToken = (bearer) => {
    if (bearer) {
        const splitedToken = bearer.split(' ');
        if (bearer.startsWith('Bearer ') && splitedToken.length === 2) {
            return splitedToken[1];
        }
    } return '';
}

const isUUIDV4 = (uuid) => {
    return (
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
            .test(uuid)
    );
}

const paginate = (query, page, perPage) => {

    const limitIsValid = !(perPage <= 0 || perPage > 100 || isNaN(perPage));

    const limit = limitIsValid ? Math.floor(perPage) : 100;
    const offset = page < 0 || isNaN(page) ? 0 : Math.floor(page) * limit;

    return {
        ...query,
        limit,
        offset
    }
}

module.exports = {
    getMissingFields,
    getToken,
    paginate,
    isUUIDV4,
}