
class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.fullName = user.fullName;
    this.email = user.email;
    this.phoneNumber = user.phoneNumber;
    this.balance = user.balance;
    this.isActive = user.isActive;
    this.createdAt = user.createdAt;
  }
}

class UserWithDevicesDTO {
  constructor(user) {
    this.id = user._id;
    this.fullName = user.fullName;
    this.email = user.email;
    this.phoneNumber = user.phoneNumber;
    this.balance = user.balance;
    this.devices = user.devices.map(device => ({
      deviceId: device.deviceId,
      deviceName: device.deviceName,
      isVerified: device.isVerified,
      verifiedAt: device.verifiedAt,
      registeredAt: device.registeredAt
    }));
    this.isActive = user.isActive;
    this.createdAt = user.createdAt;
  }
}

class TransactionDTO {
  constructor(transaction) {
    this.id = transaction._id;
    this.type = transaction.type;
    this.amount = transaction.amount;
    this.balanceBefore = transaction.balanceBefore;
    this.balanceAfter = transaction.balanceAfter;
    this.description = transaction.description;
    this.status = transaction.status;
    this.createdAt = transaction.createdAt;
  }
}

class AuthResponseDTO {
  constructor(user, token) {
    this.user = new UserDTO(user);
    this.token = token;
  }
}

module.exports = {
  UserDTO,
  UserWithDevicesDTO,
  TransactionDTO,
  AuthResponseDTO
};