/**
 * Base interface for all constants registered with each module.
 * This interface specifies the mandatory members required by any module.
 */
interface IConstants {
    /**
     * Root relative URL for all HTML templates under the module.
     * Typically, this will be /client/<module folder name>/ (note the starting and ending slashes).
     */
    templateUrlRoot: string;
}
