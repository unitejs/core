/**
 * Main application class.
 */
export class App {
    configureRouter (config, router) {
        config.map([
            {
                "route": "", "name": "child", "moduleId": "./child/child"
            }
        ]);

        this.router = router;
    }
}

/* Generated by UniteJS */