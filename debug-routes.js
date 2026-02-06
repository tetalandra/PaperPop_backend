async function test() {
    const routes = [
        './config/db.js',
        './routes/auth.js',
        './routes/invitations.js',
        './routes/templates.js',
        './routes/upload.js'
    ];

    for (const route of routes) {
        try {
            console.log(`Testing import of ${route}...`);
            await import(route);
            console.log(`✓ ${route} imported successfully`);
        } catch (error) {
            console.error(`✗ Error importing ${route}:`, error.message);
            if (error.code === 'ERR_MODULE_NOT_FOUND') {
                console.error('Code: ERR_MODULE_NOT_FOUND');
            }
        }
    }
}

test();
