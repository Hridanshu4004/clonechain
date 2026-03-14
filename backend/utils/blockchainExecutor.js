const { ethers } = require('ethers');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Execute agreement on blockchain using Ethers.js
 */
const executeOnBlockchain = async ({
  contractAddress,
  meetingId,
  agentA,
  agentB,
  split,
  iqPool,
  agreementData
}) => {
  try {
    // Get provider (RPC endpoint)
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    
    // Get wallet from private key
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log(`\n🔗 Executing agreement on blockchain...`);
    console.log(`   Meeting: ${meetingId}`);
    console.log(`   Contract: ${contractAddress}`);

    // Simple ABI for storing agreement
    const ABI = [
      {
        type: 'function',
        name: 'recordAgreement',
        inputs: [
          { name: '_meetingId', type: 'string' },
          { name: '_agentA', type: 'string' },
          { name: '_agentB', type: 'string' },
          { name: '_agentASplit', type: 'uint256' },
          { name: '_agentBSplit', type: 'uint256' },
          { name: '_amount', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable'
      }
    ];

    const contract = new ethers.Contract(contractAddress, ABI, wallet);

    const agentASplitBN = ethers.toBigInt(split?.agentAPercentage || 0);
    const agentBSplitBN = ethers.toBigInt(split?.agentBPercentage || 0);
    const amountBN = ethers.toBigInt(iqPool || 0);

    console.log(`   Sending transaction...`);
    const tx = await contract.recordAgreement(
      meetingId,
      agentA,
      agentB,
      agentASplitBN,
      agentBSplitBN,
      amountBN
    );

    console.log(`   Tx Hash: ${tx.hash}`);
    const receipt = await tx.wait();

    console.log(`   ✓ Confirmed at block: ${receipt.blockNumber}`);
    console.log(`   ✓ Gas Used: ${ethers.formatUnits(receipt.gasUsed, 'wei')} wei\n`);

    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: `${ethers.formatUnits(receipt.gasUsed, 'ether')} ETH`,
      confirmations: receipt.confirmations,
      status: receipt.status === 1 ? 'SUCCESS' : 'FAILED'
    };
  } catch (error) {
    console.error('❌ Blockchain execution error:', error.message);
    throw error;
  }
};

/**
 * Fallback: Simulate agreement storage locally
 */
const storeAgreementLocal = async ({
  meetingId,
  agentA,
  agentB,
  split,
  iqPool
}) => {
  try {
    console.log(`\n💾 Storing agreement (simulation mode)...`);
    
    const simulatedTxHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    const simulatedBlockNumber = Math.floor(Math.random() * 20000000) + 18000000;
    
    console.log(`   Simulated Tx: ${simulatedTxHash}`);
    console.log(`   Simulated Block: ${simulatedBlockNumber}\n`);

    return {
      success: true,
      txHash: simulatedTxHash,
      blockNumber: simulatedBlockNumber,
      gasUsed: '0.0034 ETH',
      confirmations: 1,
      status: 'SUCCESS',
      isSimulated: true
    };
  } catch (error) {
    console.error('Error storing agreement:', error.message);
    throw error;
  }
};

/**
 * Safe executor - tries blockchain first, falls back to simulation
 */
const executeOnBlockchainSafe = async (data) => {
  try {
    if (data.contractAddress && process.env.PRIVATE_KEY && process.env.RPC_URL) {
      return await executeOnBlockchain(data);
    } else {
      console.log('⚠️  No blockchain config, using simulation mode...');
      return await storeAgreementLocal(data);
    }
  } catch (error) {
    console.log('⚠️  Blockchain execution failed, falling back to simulation...');
    return await storeAgreementLocal(data);
  }
};

module.exports = {
  executeOnBlockchain,
  storeAgreementLocal,
  executeOnBlockchainSafe
};
