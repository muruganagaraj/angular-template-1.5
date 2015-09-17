interface IConstants {
    /**
     * Root relative URL for all HTML templates under the module.
     * Typically, this will be /client/<module folder name>/ (note the starting and ending slashes).
     */
    templateUrlRoot: string;

    /**
     * The prefix used for components such as directives and filters.
     * Use a short string and all lower-case.
     */
    componentPrefix: string;
}
