async function test() {
    try {
        console.log('Attempting to import ./server.js...');
        await import('./server.js');
        console.log('✓ server.js imported successfully');
    } catch (error) {
        console.error('✗ Error importing server.js:');
        console.error(error);
    }
}

test();
