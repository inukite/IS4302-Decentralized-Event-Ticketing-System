const LoyaltyPoints = artifacts.require('LoyaltyPoints');

contract('LoyaltyPoints', (accounts) => {
  let loyaltyPoints;

  before(async () => {
    loyaltyPoints = await LoyaltyPoints.deployed();
  });

  it('should allow the owner to add loyalty points to a user', async () => {
    const userAddress = accounts[1];
    const initialPoints = await loyaltyPoints.lpBalances(userAddress);
    await loyaltyPoints.addLoyaltyPoints(userAddress, 100, {
      from: accounts[0],
    });
    const finalPoints = await loyaltyPoints.lpBalances(userAddress);
    assert.equal(
      finalPoints.toNumber(),
      initialPoints.toNumber() + 100,
      '100 LP should be added to the user'
    );
  });

  it('should allow the owner to subtract loyalty points from a user', async () => {
    const userAddress = accounts[1];
    await loyaltyPoints.addLoyaltyPoints(userAddress, 200, {
      from: accounts[0],
    }); // Ensure the user has enough LP
    await loyaltyPoints.subtractLoyaltyPoints(userAddress, 50, {
      from: accounts[0],
    });
    const finalPoints = await loyaltyPoints.lpBalances(userAddress);
    assert.equal(
      finalPoints.toNumber(),
      250,
      '50 LP should be subtracted from the user'
    );
  });

  it('should not allow a non-owner to add loyalty points', async () => {
    try {
      await loyaltyPoints.addLoyaltyPoints(accounts[1], 100, {
        from: accounts[1],
      });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'revert',
        "The error message should contain 'revert'"
      );
    }
  });

  it('should not allow a non-owner to subtract loyalty points', async () => {
    try {
      await loyaltyPoints.subtractLoyaltyPoints(accounts[1], 50, {
        from: accounts[1],
      });
      assert.fail('The transaction should have thrown an error');
    } catch (err) {
      assert.include(
        err.message,
        'revert',
        "The error message should contain 'revert'"
      );
    }
  });
});
