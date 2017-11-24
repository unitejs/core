/**
 * Main application class.
 *
 * @export
 * @class App
 */
export class App {
    /**
     * Run the application
     * @returns {void}
     */
    public run(): void {
        const style = document.createElement("style");
        style.type = "text/css";
        style.appendChild(document.createTextNode(".child { font-size: 20px }"));
        document.head.appendChild(style);

        const child = document.createElement("span");
        child.innerText = "Hello UniteJS World!";
        child.className = "child";

        document.getElementById("root").appendChild(child);
    }
}

// Generated by UniteJS