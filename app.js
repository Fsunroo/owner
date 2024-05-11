let web3;
let lotteryContract;
const contractAddress = '0xC4Df03E9d6Be89A7ba58B92fAaAA46CE2A0f1329'; // Replace with your contract address
let accounts;

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

async function startNewRound(){
    const ticketPrice = parseInt(document.getElementById('ticketPrice').value);
    const accounts = await web3.eth.getAccounts();
    // console.log(ticketPrice*(10**18))
    lotteryContract.methods.startRound(ticketPrice*(10**18)).send({
        'from':accounts[0]
    })
}

async function givePrize(){
    const accounts = await web3.eth.getAccounts();
    lotteryContract.methods.givePrizes().send({
        'from':accounts[0]
    })
}

async function cancelRound(){
    const accounts = await web3.eth.getAccounts();
    lotteryContract.methods.cancelRound().send({
        'from':accounts[0]
    })
} 