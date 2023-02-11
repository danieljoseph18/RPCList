//Once DOM loads, truncate the RPC URL and add it to the .rpc-url element to display on the page
document.addEventListener("DOMContentLoaded", function() {
    const truncatedTextElements = document.querySelectorAll(".full-url");
    truncatedTextElements.forEach(truncatedTextElement => {
      const fullText = truncatedTextElement.innerHTML;
      const truncatedText = fullText.substring(0, 20) + "...";

      // Get the neighboring .rpc-url element
      const rpcUrlElement = truncatedTextElement.nextElementSibling.nextElementSibling;
      rpcUrlElement.innerHTML = truncatedText;
    });
  });

//Add event listener to "Connect to Metamask" button so it calls the enableMetaMask function  
document.addEventListener('DOMContentLoaded', function() {
    var connectButton = document.getElementById("connect");
    connectButton.addEventListener('click', enableMetaMask);
    });

//Add event listener to "Add to Metamask" buttons so it calls the addToMetamask function
document.addEventListener('DOMContentLoaded', function() {
    var addToMetamaskButtons = document.querySelectorAll(".addtometamask");
    addToMetamaskButtons.forEach(function(button) {
        button.addEventListener('click', addToMetamask);
    })
}); 

//Used to convert the chain ID to a hex value to pass to the addEthereumChain function
const toHex = (num) => {
return "0x" + num.toString(16);
};

//Function to connect to MetaMask
async function enableMetaMask() {
    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed');
        return;
    }

    try {
        const accounts = await window.ethereum.send('eth_requestAccounts');
        const web3 = new Web3(window.ethereum);
        console.log(`MetaMask is connected with account: ${accounts[0]}`);
        const connectButton = document.getElementById("connect");
        connectButton.innerHTML = "Connected";
    } catch (error) {
        console.log(`Error enabling MetaMask: ${error.message}`);
    }
}

//Function to add custom RPC to MetaMask
async function addToMetamask(event) {
    //Gets button that was clicked
    const addToMetamaskButton = event.target;
    const parentNode = addToMetamaskButton.closest('div');
    //Gets targets for each of the elements required to add the custom RPC to MetaMask
    const rpcTitleNode = parentNode.querySelector('.rpc-header');
    const rpcUrlNode = parentNode.querySelector('.rpc-link');
    const chainIdNode = parentNode.querySelector('.rpc-chain-id');
    //Gets the values of the elements
    const rpcTitle = rpcTitleNode.innerHTML;
    const rpcUrl = rpcUrlNode.innerHTML;
    const chainId = chainIdNode.innerHTML;
    
    //Checks if MetaMask is installed and connected
    await enableMetaMask();

    //Checks if the chain ID is valid and sets the parameters for the native currency and block explorer
    let nativeCurrency;
    let blockExplorer;
    if(chainId == 56 || chainId == 38){
        nativeCurrency = {name: 'BNB', symbol: 'BNB', decimals: 18}
        blockExplorer = 'https://bscscan.com/';
    } else if(chainId == 137 || chainId == 17 || chainId == 89){
        nativeCurrency = {name: 'Matic', symbol: 'MATIC', decimals: 18}
        blockExplorer = 'https://polygonscan.com/';
    } else if (chainId == 1) {
        nativeCurrency = {name: 'Ether', symbol: 'ETH', decimals: 18}
        blockExplorer = 'https://etherscan.io/';
    }

    //add custom RPC to Metamask with RPC URL, chain ID, and chain name
    const params = {
        chainId: toHex(chainId), // A 0x-prefixed hexadecimal string
        chainName: rpcTitle,
        nativeCurrency: {
        name: nativeCurrency.name,
        symbol: nativeCurrency.symbol, // 2-6 characters long
        decimals: nativeCurrency.decimals,
        },
        rpcUrls: [rpcUrl],
        blockExplorerUrls: [blockExplorer],
    };
    //Sends call to Ethereum provider to add the custom RPC to MetaMask
    window.ethereum.sendAsync({
        method: 'wallet_addEthereumChain',
        params: [params, window.ethereum.selectedAddress],
    }, function(error, result) {
        if (error) {
            console.error(error);
            alert('Error adding custom RPC to Metamask. Please check your settings.');
        } else {
            console.log(result);
        }
    });
}

