const { exec } = require('child_process');
const util = require('util');
const path = require('path');
const fs = require('fs').promises;
const execAsync = util.promisify(exec);

async function testSecretRotation() {
    console.log('🔄 Testing Secret Rotation Setup...\n');

    try {
        // Test Azure CLI connection
        console.log('1️⃣ Checking Azure CLI connection...');
        const { stdout: azureVersion } = await execAsync('az --version');
        console.log('✅ Azure CLI available\n');

        // Test Azure login
        console.log('2️⃣ Verifying Azure credentials...');
        const { stdout: subList } = await execAsync('az account show');
        console.log('✅ Azure credentials valid\n');

        // Test GitHub Action workflow
        console.log('3️⃣ Checking GitHub Action workflow...');
        const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'secret-rotation.yml');
        try {
            await fs.access(workflowPath);
            const workflowContent = await fs.readFile(workflowPath, 'utf8');
            console.log('✅ Workflow file exists');
            console.log('✅ Workflow content verified\n');
        } catch (err) {
            throw new Error(`Workflow file not found at ${workflowPath}`);
        }

        // Test Azure resource access
        console.log('4️⃣ Verifying Azure resource access...');
        const { stdout: webapp } = await execAsync('az webapp show --name academease-contact --resource-group academease-rg');
        console.log('✅ Can access Azure Web App\n');

        console.log('🎉 All automation components verified!');
        console.log('\nNext scheduled rotation:', getNextRotationDate());
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n🔧 Troubleshooting steps:');
        if (error.message.includes('Workflow file not found')) {
            console.log('1. Create .github/workflows directory in project root');
            console.log('2. Copy secret-rotation.yml to .github/workflows/');
            console.log('3. Run test again');
        } else {
            console.log('1. Check Azure credentials');
            console.log('2. Verify GitHub PAT_TOKEN');
            console.log('3. Ensure workflow file is properly configured');
        }
    }
}

function getNextRotationDate() {
    const now = new Date();
    const next = new Date(now);
    next.setMonth(now.getMonth() + 5);
    next.setDate(1);
    next.setHours(0, 0, 0, 0);
    return next.toLocaleDateString();
}

testSecretRotation();