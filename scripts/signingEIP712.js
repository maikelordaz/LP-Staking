const Web3 = require("web3");
const sigUtils = require("@metamask/eth-sig-util");

  let from;

  (async function connect() {
    await ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    from = accounts[0];
    console.log("Connected Account:", from);
  })();


    console.log("Chain ID: ", Number(web3.givenProvider.networkVersion));

    const domain = [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ];
    const stakeOrder = [
      { name: "msg", type: "string" },
    ];    

    const domainData = {
      name: "LP Staking",
      version: "1",
      chainId: Number(web3.givenProvider.networkVersion),
      verifyingContract: "0x10Fc2b22270a4ea2DD80D575ae52eC4eb67A53ab",
    };

    nowTimestamp = 1603141854;

    const message = {
      msg: "Sign to stake your LP tokens",
    };

    const data = JSON.stringify({
      types: {
        EIP712Domain: domain,
        Order: stakeOrder,
      },
      domain: domainData,
      primaryType: "Order",
      message: message,
    });

    const signer = web3.utils.toChecksumAddress(from);

    web3.currentProvider.sendAsync(
      {
        method: "eth_signTypedData_v3",
        params: [signer, data],
        from: signer,
      },
      function (err, result) {
        if (err || result.error) {
          return console.error(result);
        }
        const signature = result.result;
      }
    );