import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Caver, { AbiItem, Contract, KeyringContainer, Result } from 'caver-js';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/auth/schemas/user.schema';

import CONTRACT_ABI from '../../lib/abi_ZeroTEB.json';
import { ContractEventDto, ContracCreateEventkDto } from './klaytn.entity';
const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || '0xcDeCE0A0074e1805820B6938ee4D6443e6fDA61e';
const GAS = '200000000';

@Injectable()
export class KlaytnService {
  private contract: Contract | null;

  constructor(
    @Inject('Klaytn') private readonly caver: Caver,
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
  ) {
    if ([CONTRACT_ABI, CONTRACT_ADDRESS].every(Boolean)) {
      const contractInstance = this.caver.contract.create(
        CONTRACT_ABI as AbiItem[],
        CONTRACT_ADDRESS,
      );
      this.contract = contractInstance;
    } else {
      this.contract = null;
    }
  }

  /**
   * @description caver.wallet는 인메모리 지갑에서 Keyring 인스턴스를 관리하는 패키지입니다.
   * caver.wallet는 모든 SingleKeyring, MultipleKeyring, RoleBasedKeyring을 받으며,
   * 주소를 기준으로 관리합니다. */
  get wallet() {
    return this.caver.wallet as KeyringContainer;
  }

  /**
   * @description caver.account는 계정 업데이트시 사용 되며 Account에 관련된 기능을 제공하는 패키지입니다. */
  get account() {
    return this.caver.account;
  }

  /**
   * @description caver.rpc는 Klaytn 노드에 RPC 호출을 하는 기능을 제공하는 패키지입니다.
   */
  get rpc() {
    return this.caver.rpc;
  }

  /**
   * @description Keyring은 Klaytn 계정의 주소와 개인 키를 포함하는 구조입니다. */
  keyring() {
    const randomHex = this.caver.utils.randomHex(32);
    return this.wallet.keyring.generate(randomHex);
  }

  /**
   * @description SingleKeyring은 개인 키를 가지고 있는 키링 패키지입니다.
   * @param address
   * @param privateKey
   */
  singleKeyring(address: string, privateKey: string) {
    return this.wallet.newKeyring(address, privateKey);
  }

  /**
   * @description 주어진 주소가 올바른 주소인지 체크
   * @param address
   */
  isAddress(address: string) {
    return this.caver.utils.isAddress(address);
  }

  /**
   * @description 모든 KLAY 단위를 보여줍니다. */
  klayUnit() {
    return this.caver.utils.klayUnit;
  }

  async createEvent(event: ContracCreateEventkDto): Promise<void> {
    const inputData = [
      event.creator,
      event.eventName,
      event.eventType,
      event.tokenImageUri,
      event.classNames,
      event.classPrices,
      event.classCounts,
      event.openTime,
      event.closeTime,
      event.endTime,
    ];
    let price = 0;
    for (let i = 0; i < event.classPrices.length; i++) {
      price += event.classPrices[i] * event.classCounts[i];
    }
    price *= 0.05;
    price *= 10 ** 18;
    console.log(price, 'KLAY');
    const user = await this.UserModel.findOne({ test_address: event.creator });
    if (!this.caver.wallet.isExisted(user.test_address)) {
      this.singleKeyring(user.test_address, user.test_private_key);
    }
    const receipt = await this.contract.methods.createEvent(...inputData).send({
      from: user.test_address,
      gas: GAS,
      value: this.caver.utils.toPeb(price, 'peb'),
    });
    console.log(receipt);
  }

  async getEvent(eventId: number): Promise<ContractEventDto> {
    const contractEventDto: ContractEventDto = new ContractEventDto();
    const event = await this.contract.methods.getEvent(eventId).call();
    const prices = [];
    for (let i = 0; i < Number(event._classCount); i++) {
      const receipt = await this.contract.methods.getEventClass(eventId, i).call();
      prices.push({
        class: receipt[0],
        price: Number(receipt[1]),
        count: Number(receipt[2]),
      });
    }
    contractEventDto.name = event._name;
    contractEventDto.tokenImageUri = event._tokenImageUri;
    contractEventDto.creator = event._creator;
    contractEventDto.classCount = Number(event._classCount);
    contractEventDto.prices = prices;
    contractEventDto.openTime = Number(event._openTime);
    contractEventDto.closeTime = Number(event._closeTime);
    contractEventDto.endTime = Number(event._endTime);

    return contractEventDto;
  }
}