// ESM loader to help with module resolution issues
export async function resolve(specifier, context, defaultResolve) {
    // Handle @linguardian/shared imports
    if (specifier.startsWith("@linguardian/shared")) {
        try {
            return defaultResolve(specifier, context);
        } catch (error) {
            // If default resolution fails, try with explicit .js extension
            const jsSpecifier = specifier.replace(/(\.ts)?$/, ".js");
            return defaultResolve(jsSpecifier, context);
        }
    }

    return defaultResolve(specifier, context);
}
