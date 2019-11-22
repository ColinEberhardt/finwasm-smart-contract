
let contract, walletAccount;

(async () => {

  // connect to the near network
  const near = await nearlib.connect(
    Object.assign(nearConfig, {
      deps: { keyStore: new nearlib.keyStores.BrowserLocalStorageKeyStore() }
    })
  );

  // obtain the wallet account and smart contract
  walletAccount = new nearlib.WalletAccount(near);
  contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: ["getRemainingTicketCount", "getAttendeeList"],
    changeMethods: ["signUp", "hasSignedUp"],
    sender: walletAccount.getAccountId()
  });

  // utility function to update UI state to show / hide respective controls
  async function updateUI(state) {
    // show the UI controls based on current state
    Array.from(document.querySelectorAll(".state")).map(
      it => (it.style = "display: none;")
    );
    document.querySelector("." + state).style = "display: block;";
  
    // fetch the remaining places
    const ticketCount = await contract.getRemainingTicketCount();
    document.getElementById("remaining-places").innerText = ticketCount;
  }
  

  // add event handlers
  document.querySelector(".sign-in").addEventListener("click", () => {
    walletAccount.requestSignIn(nearConfig.contractName, "FinWASM");
  });
  
  const attendButton = document.querySelector(".attend-meetup");
  attendButton.addEventListener("click", async () => {
    attendButton.classList.add("disabled");
    const signUpResult = await contract.signUp();
    if(signUpResult === "success") {
      updateUI("state-signed-up");
    } else {
      console.error(signUpResult);
    }
  });
  
  document.querySelector(".sign-out").addEventListener("click", () => {
    walletAccount.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  });

  if (walletAccount.getAccountId()) {
    const signedUp = await contract.hasSignedUp()
    updateUI(signedUp ? "state-signed-up" : "state-signed-in");
  } else {
    updateUI("state-sign-in-required");
  }
})();


// async function connectMock() {
//   window.walletAccount = {
//     getAccountId: () => "colineberhardt"
//   };

//   let tickets = 50;

//   window.contract = {
//     getRemainingTicketCount: () => Promise.resolve(tickets),
//     signUp: () => {
//       tickets--;
//       return Promise.resolve("success");
//     },
//     hasSignedUp: () => Promise.resolve(false)
//   };
// }