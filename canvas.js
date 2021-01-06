(() => {
    let canvas, ctx;
    let painting = false;
    //let erasing = false;

    /** Create the canvas once the window loads.
     */
    window.addEventListener("load", () => {
        canvas = document.createElement("canvas");
        resize_canvas();

        canvas.id = "annotations";
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");

        // Set up the menu
        set_defaults();
        set_colors();
        set_tools();

        // Canvas event listeners
        canvas.addEventListener("mousedown", on_click);
        canvas.addEventListener("mouseup", on_release);
        canvas.addEventListener("mousemove", draw);

        // Global event listeners
        window.addEventListener("resize", resize_canvas);
    });

    /**
     * Select something from the menu.
     * @param {string} typestr  The "type" of the item being selected (ie. "color", "tool")
     * @param {Event} event     The event that triggered the callback
     */
    function select_from_menu(typestr, event) {
        if (!(typeof typestr === "string") || typestr.length <= 1)
            return;

        let prev = document.getElementsByClassName("selected " + typestr + "-select")[0];
        if (prev === null || prev === undefined)
            return;

        prev.classList.remove("selected");

        let selected = event.target;
        selected.classList.add("selected");

        if (typestr === "color")
            ctx.strokeStyle = selected.id;
        else if (typestr === "tool")
            // if (selected.id === "eraser")
            //     erasing = true;
            // else
            ctx.lineCap = selected.id;
    }

    /**
     * Set the width of the tool being used.
     * @param {number} tool_width   The width to set the tool to
     */
    function set_tool_width(tool_width) {
        ctx.lineWidth = tool_width;
    }

    /**
     * Set the default drawing options from the selected items in the menu.
     */
    function set_defaults() {
        let color = document.getElementsByClassName("selected color-select")[0];
        let tool = document.getElementsByClassName("selected tool-select")[0];
        let tool_width = document.getElementById("tool-width");

        ctx.strokeStyle = color.id;
        ctx.lineCap = tool.id;
        ctx.lineWidth = tool_width.value;
    }

    /**
     * Set the colors' click listeners.
     */
    function set_colors() {
        let colors = document.getElementsByClassName("color-select");

        for (let i = 0; i < colors.length; i++) {
            colors[i].addEventListener("click", (event) => {
                select_from_menu("color", event);
            });
        }
    }

    /**
     * Set the tools' click listeners.
     */
    function set_tools() {
        let tools = document.getElementsByClassName("tool-select");

        for (let i = 0; i < tools.length; i++) {
            tools[i].addEventListener("click", (event) => {
                select_from_menu("tool", event);
            });
        }

        let tool_width = document.getElementById("tool-width");
        tool_width.addEventListener("change", (event) => {
            set_tool_width(event.target.value);
        });
    }

    /**
     * Resize the canvas based on the size of the window.
     */
    function resize_canvas() {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
    }

    /**
     * Start to draw on click.
     * @param event
     */
    function on_click(event) {
        painting = true;
        ctx.beginPath();
        draw(event);
    }

    /**
     * Stop drawing when released.
     */
    function on_release() {
        painting = false;
    }

    /**
     * Draw while the mouse is down.
     * @param event
     */
    function draw(event) {
        if (!painting)
            return;

        // Account for the offset of the canvas to ensure the line is
        // directly under the cursor
        ctx.lineTo(event.clientX - canvas.offsetTop, event.clientY - canvas.offsetLeft);
        ctx.moveTo(event.clientX - canvas.offsetTop, event.clientY - canvas.offsetLeft);
        ctx.stroke();
    }
})();