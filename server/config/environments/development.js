module.exports = {
    rootPath: null,
    port: process.env.PORT || 1000,
    db: {
        client: 'pg',
        connection: 'postgres://postgres:P@ssw0rd@localhost:5432/dbLucaDemo',
        debug: true
    },
    user: {
        id: 'aaa2a686-1cb7-45ab-9660-5e8736ca821f',
        name: 'کاربر عمومی',
        image: `data:image/png;base64,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`
    },
    branch:{
        id: 'fe008543-6857-4d0e-ba9b-d7c987ff9909',
        name: 'شرکت پیش فرض',
        logo: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAH6UlEQVR42tWbC1BUVRiA/2V5KCKID0SBWERMHC0kX9hMI5GpQ2b5yNJ8NYqjTuVjSlOzqTCzB6IOkugoRo1hapKPMNFsmkQdIiwDRFmX90NgZV+w7IP+Axdll33cvfdcFv6Zf87dvfece/7vnnvOf/57jggElmXxuU9iEoX6NOpoVAnqUFRfs0vlqDWoMtRC1Fuo2ce2R94Rsn4iAQwWY/IC6jzUWNThPIusRD2Pego1C4EYeiQANNwfkzWoKykYbQvGYdRkBFHdIwCg4cMw2Y76FmofgQw3l2bUI6jxCKLKKQDQcDdMNjLGe3WT4eaiIhBQExCErtsAoPERmKShjnWS4eZyG3UJQsgTHAAa/zYmX6J6ONtqM9GivocQ9gsCAA13xySFHDrbUjuSiroaQbRQA4DGe2KSAe3DW2+QLNQ5CEHDGwBj/BXUyc62ykG5gfq8PQg2ATDNnjghveXJmwtpCbG2Xgd7AI5istzZVvCUVASwwmEATG+/z9m1pyTvWBsdLAJgxvnr0POGOq5ChsgplvyELgAYDy8XusHJcXdzaUtbdMbugECcpUhzj9ESgM2YfC5kTTw9xLBqTjBEjPRu+513TwGHMkpAo6U60bMkWxDAbqsAmIlNEQjo2w/ydoONr4dCwJC+Jv9XPGiCPelSqGtk5b9wFTJ3GNV5AmUOIAmTtULdXeLfFzYsDAUfLzeL5xtVOoRQDLLqJiEhHEAA67oAYObzMhCo44sI84Y1r0jAw11s8zot9gfJP8kg726jUADIVDqkI57QGcDHmOwQ4o4xEwbD4umB4OLCbuphNLbC95fK4XJOnVAQPkEAHz0CwISxSoFyJIcUvjAmAGZO8eOUP/NGLaRnVUArfQAksvQECa91AJhB7kfzDu6uIlj1cjBMDPflVU5O4UNIyZBBi546hpkI4GIHADLNXUWr5P6ervDughEwMrAflfKKK9SQeEIKSo2eJoBDCCCuA0AFUGr+/gM92oY5P1+6fWmtXAsJPxRDdYOWVpGVCCBAxMTtC2mUGIZPnDx5L2wBQogKW8C+k1IoKlPTKnI0AbAcD47yLWnymAGwcnYwuLm6sDSmBcqrFW3Hgf7eCM2dVT6d3giHz5bCjXw5DQArCIA9eLCeTymxUX4wP3o4iETshrmLf96DlB//wjlAu+vr7iaGuAXPwIxnR7LK39raCievVsH5azV8ASQSAL/gwUwuucmwvnRWEEwbP5h1nspaJaz59FzbWG9SFhaW/OFLMNyvP+uyrubWQeoFGY63YtZ5zCSTACiA9m92DkkfdxdYNzcExoV6O5Tvt5v3IeFYtsVzG5dFQfSkEIfKy7tTB8kZZehBcgJQSAA0QNcPlTbFp58rbHojFJ4Y6unwHQukD+D9ry9ZPPfFpukQPmKIw2XKqlQ4QkhBoXF4NiknABz2MJZhs4+ONG325H0m7zIbSUzLhsvX75v8FzMlBNYviWKV32Awglhs2tn+ml0CaZdq8H83VmV0CCcAS2YEon//+EnV1qth1+E/YM9mdl0J6cRyC6pAWtbek48I8oXI8GGsO9Gk4zdh/otjYOigx7P2878XQcqpW+A9ONghCJwAePUVw6IYPwgN9IJ7pQ1w8EQOyBXNcDZpkaNFcZIPErOgvEYBqxdMgLDggVAkq4dv0nNAodaCCxrvCAROAIgYDXpQ1JeCQf/YM+tOALfv1lo97wgETp2gNQg9BYADEOSch0FLEHoSAJYQCnk5QuYQzuydx+p6abkccvMrH0WDSZRo0rgACPL3oQqABYRMKq5wB4Rvd0y0e11+cS1s23sF9AbTULgrziF2b5gOoySDqAKwAyGR2mSISOq28XavSTh2Db1BmcVz0ZMk6A1OpQ7ABoQVVKfDbABsxcr/a6Xy48L84LP19r/DcgFgCUKr0TiaakCEDQBblR+LAHYJCMAMQntAhAFAJSTWGwB0QOjn43/oePxzcVSDor0FAAMh9uf9r12gGhbvRQCq0AcMOndgkYHqh5FeBGDnuQOLyfrGLp/GyByV82rPXgKA+O0hCKDKBAADgdfH0Z1x4RAwxDY/vgB0egMs33YGFCqu4XFRMjb9RzZS/Tw+MXwArH1VYnNezxfAd2dvQXrmfxyNBzWaPAoBVFoEwEDgtUDiKYkrzJ0WBJKAAVQBlFY1wumsArh8Xcq1asTcrWj8LpN/LADgtUSGRHs0jTXQrKESt6coonysXQS++7aXyDAQeC+S0ihqoUlV72yrOwQ7DNFUfPq5XbBYy0FjmVyTsg40ygfONp6YuQGNT7R4xlY2Ggslm9VyUDdS2dzB1fg0NH6p1bN2AFBZKqvVNILqYSWfIrgKWeM8C997bktlGQhUFktrmxSgkld0o+2im9jpRaPx3BdLm0HgvVy+pVkFSnk5GSqEtp48sNn2jGcNgIFAXoeDwLNP0GnVoGwoRwZCrQ4VpSHhlbaaPScAnUDw3jKja2lCCGXQaqS6MpQMdVus9fbUADAQeG+a0uua2yLJdCAQJwfeROP/djgn11vS2DZn0LcghJK2iDJHIb79TmzyX5l7eIID6ASC18ZJg0EHijoCwaH6N2PViY8S33li4xQAnUBw3jpr6TujFSFz+CNY7SQ0nNeOUeoAOoHgtHnaiH2BEiGQvsFMiBtJnLHTqBexqffMzdM2gLDePo8QapT1ZSV6vfYO9o7/4H/X0OACIev3P/3OnJmT3nfOAAAAAElFTkSuQmCC`,
        changeUrl: 'http://dev-storm:2000/branch/change'
    },
    version: {
        vendor: '1.0.0',
        acc: '1.0.0',
        css: '1.0.0',
        template: '1.0.0'
    },
    auth: {
        url: 'http://dev-storm:2000/auth',
        returnUrl: 'http://dev-storm:1000/auth/return',
        logout: 'http://dev-storm:1000/auth/logout',
        storm: {
            getBranches: 'http://localhost:2000/api/branches'
        }
    }
};
