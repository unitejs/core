/**
 * Gulp utils for env.
 */

const envUnite = {};

function get (name) {
    return envUnite[name];
}

function set (name, value) {
    envUnite[name] = value;
}

module.exports = {
    get,
    set
};

/* Generated by UniteJS */
