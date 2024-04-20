let web3;
let lotteryContract;
const contractAddress = '0x3328358128832A260C76A4141e19E2A943CD4B6D'; // Replace with your contract address

document.getElementById('connectWallet').addEventListener('click', async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            lotteryContract = new web3.eth.Contract(abi, contractAddress);
            const accounts = await web3.eth.getAccounts();
            document.getElementById('walletAddress').innerText = 'Connected Wallet: ' + accounts[0];
            getRoundDetails();
        } catch (error) {
            console.error(error);
        }
    } else {
        alert('MetaMask not found. Please install it to interact.');
    }
});

async function buyTickets() {
    const numTickets = document.getElementById('numTickets').value;
    const ticketPrice = await lotteryContract.methods.rounds(await lotteryContract.methods.currentRoundId().call()).call();
    const totalCost = ticketPrice.ticketPrice * numTickets;
    const accounts = await web3.eth.getAccounts();
    
    lotteryContract.methods.buyTickets(numTickets).send({
        from: accounts[0],
        value: totalCost
    }).then(function(result) {
        alert('Tickets bought successfully!');
    }).catch(function(err) {
        console.error(err);
        alert('Failed to buy tickets!');
    });
}

async function getRoundDetails() {
    const roundId = await lotteryContract.methods.currentRoundId().call();
    const round = await lotteryContract.methods.getRoundDetails(roundId).call();
    const details = `
        Round ID: ${roundId}
        Ticket Price: ${round[0]}
        Total Collected: ${round[1]}
        Total Players: ${round[2]}
        Total Chances: ${round[3]}
        Is Active: ${round[4] ? 'Yes' : 'No'}
    `;
    document.getElementById('roundDetails').innerText = details;
}
