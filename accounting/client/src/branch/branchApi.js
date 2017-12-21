"use strict";

export default class BranchApi {

    constructor(apiPromise) {
        this.apiPromise = apiPromise;
    }

    getAll() {
        return this.apiPromise.get('/api/branches');
    }

    getMyBranches() {
        return this.apiPromise.get('/api/branches/my');
    }

    getCurrent() {
        return this.apiPromise.get('/api/branches/current');
    }

    getApiKey() {
        return this.apiPromise.get('/api/branches/current/api-key');
    }

    save(data) {
        return this.apiPromise.put('/api/branches/current', data);
    }

    activate(id) {
        return this.apiPromise.put(`/api/branches/${id}/activate`);
    }

    deactivate(id) {
        return this.apiPromise.put(`/api/branches/${id}/deactivate`);
    }

    addMeToBranch(id) {
        return this.apiPromise.put(`/api/branches/${id}/add-me`);
    }

    removeMeFromBranch(id) {
        return this.apiPromise.delete(`/api/branches/${id}/remove-me`);
    }

    remove(id) {
        return this.apiPromise.delete(`/api/branches/${id}`);
    }

    setDefaultLogo(id) {
        return this.apiPromise.put(`/api/branches/${id}/default-logo`);
    }

    total() {
        return this.apiPromise.get(`/api/branches/total`);
    }

    isOwnerUser() {
        return this.apiPromise.get('/api/branches/users/is-owner');
    }

    getBranchUsers() {
        return this.apiPromise.get('/api/branches/users');
    }

    addUserByEmail(email) {
        return this.apiPromise.put(`/api/branches/users/${email}`);
    }

    deleteUserByEmail(email) {
        return this.apiPromise.delete(`/api/branches/users/${email}`);
    }

    regenerateToken(id){
        return this.apiPromise.put(`/api/branches/users/${id}/regenerate-token`);
    }

    getCurrentBranchLogo() {
        return this.apiPromise.get(`/api/branches/logo`);
    }

    renewChartOfAccounts(id) {
        return this.apiPromise.post(`/api/branches/${id}/renew-chart-of-accounts`);
    }

    getSettings(id) {
        return this.apiPromise.get(`/acc/api/settings/${id}`);
    }

    saveSettings(id, data){
        return this.apiPromise.put(`/acc/api/settings/${id}`, data);
    }

}