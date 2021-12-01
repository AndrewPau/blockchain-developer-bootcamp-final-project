let BN = web3.utils.BN;
var PauToken = artifacts.require("./PauToken.sol");
const { catchRevert } = require("./exceptionHelpers.js");

contract("PauToken", function (accounts) {
    const [contractOwner, alice] = accounts;

    const initialSupply = 1000000;
    const price = 10 ** 16;
    const purchaseLimit = 20;
  
    beforeEach(async () => {
      instance = await PauToken.new(initialSupply);
    });

    it("is owned by owner", async () => {
        assert.equal(
          await instance.owner.call(),
          contractOwner,
          "owner is not correct",
        );
    });

    it("should update the remaining supply after purchasing", async () => {
        var tokensToPurchase = 1;
        await instance.purchaseToken(tokensToPurchase, { from: alice, value: price });

        assert.equal(
            await instance.balanceOf(instance.address) / 10 ** 18,
            initialSupply - tokensToPurchase,
            "remainingSupply did not update correctly"
        );
    });

    it("should emit a PurchaseToken event when tokens are purchased", async () => {
        let eventEmitted = false;
        const tx = await instance.purchaseToken(1, { from: alice, value: price });
  
        if (tx.logs[1].event == "PurchaseToken") {
          eventEmitted = true;
        }
  
        assert.equal(
          eventEmitted,
          true,
          "purchasing tokens should emit a PurchaseToken event",
        );
    });

    it("should emit a WithdrawFunds event when tokens are withdrew", async () => {
        let eventEmitted = false;
        const _ = await instance.purchaseToken(1, { from: alice, value: price });
        const tx = await instance.withdraw({ from: contractOwner});
  
        if (tx.logs[0].event == "WithdrawFunds") {
          eventEmitted = true;
        }
  
        assert.equal(
          eventEmitted,
          true,
          "withdrawing should emit a WithdrawFunds event",
        );
    });

    it("should error when someone other than the owner tries to withdraw funds", async () => {
        await catchRevert(instance.withdraw({ from: alice}));
    });

    it("should error when no funds are available to withdraw", async () => {
        await catchRevert(instance.withdraw({ from: contractOwner}));
    });

    it("should error when not enough value is sent when purchasing tokens", async () => {
        await catchRevert(instance.purchaseToken(1, { from: alice, value: price - 100 }));
    });

    it("should error when attempting to purchase more than the purchaseLimit", async() => {
        await catchRevert(instance.purchaseToken(purchaseLimit+1, { from: alice, value: (purchaseLimit+1) * price }));
    });

    it("should error when not enough tokens remain", async () => {
        instance = await PauToken.new(3);
        await catchRevert(instance.purchaseToken(5, { from: alice, value: 5 * price }));
    });

    it("should error when purchasing a non-positive amount of tokens", async () => {
        await catchRevert(instance.purchaseToken(0, { from: alice, value: price }));
    });
});
