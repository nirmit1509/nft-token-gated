'use strict';
require('dotenv').config();

/* import moralis */
const Moralis = require('moralis/node');

/* Moralis init code */
const serverUrl = process.env.YOUR_SERVER_URL;
const appId = process.env.YOUR_APP_ID;
const masterKey = process.env.YOUR_MASTER_KEY;

const connectToMoralis = async () => {
  try {
    await Moralis.start({ serverUrl, appId, masterKey });
    console.log('Moralis Node started...');
  } catch (error) {
    console.log(error);
  }
};

const getAllNFTs = async (chain, owner_address) => {
  const options = {
    chain: chain,
    address: owner_address,
  };
  const allNFTs = await Moralis.Web3API.account.getNFTs(options);
  let nftList = [];
  allNFTs.result.forEach((element) => {
    nftList.push({
      contract_type: element.contract_type,
      contract_address: element.token_address,
      token_id: parseInt(element.token_id),
      amount: parseInt(element.amount),
      token_metadata: JSON.parse(element.metadata),
    });
  });
  console.log(nftList);
};

const getAllNFTsForContract = async (
  chain,
  owner_address,
  contract_address,
  token_ids = null,
) => {
  const options = {
    chain: chain,
    address: owner_address,
    token_address: contract_address,
  };
  const allNFTs = await Moralis.Web3API.account.getNFTsForContract(options);
  let result = allNFTs.result[0]
    ? {
        contract_type: allNFTs.result[0].contract_type,
      }
    : {};
  let nftList = [];
  allNFTs.result.forEach((element) => {
    (token_ids === null || token_ids.includes(parseInt(element.token_id))) &&
      nftList.push({
        token_id: parseInt(element.token_id),
        amount: parseInt(element.amount),
        token_metadata: JSON.parse(element.metadata),
      });
  });
  result.contract_address = contract_address;
  result.chain = chain;
  result.count = nftList.length;
  result.status = nftList.length > 0;
  result.data = nftList;
  console.log(result);
};

const getAllNFTsForMultipleContracts = async (
  chain,
  owner_address,
  contract_addresses,
  token_ids = null,
) => {
  let result = {};
  await Promise.all(
    contract_addresses.map(async (contract) => {
      let options = {
        chain: chain,
        address: owner_address,
        token_address: contract,
      };
      let allNFTs = await Moralis.Web3API.account.getNFTsForContract(options);
      let obj = allNFTs.result[0]
        ? {
            contract_type: allNFTs.result[0].contract_type,
          }
        : {};
      let nftList = [];
      allNFTs.result.forEach((element) => {
        nftList.push({
          token_id: parseInt(element.token_id),
          amount: parseInt(element.amount),
          token_metadata: JSON.parse(element.metadata),
        });
      });
      obj.contract_address = contract;
      obj.chain = chain;
      obj.count = nftList.length;
      obj.status = nftList.length > 0;
      obj.data = nftList;
      // console.log(obj);
      result[contract] = obj;
    }),
  );
  console.log(result);
};

connectToMoralis();

/* User A */
// getAllNFTs('mumbai', '0xf2b3Bc6Dc2923ebcBBb702C952c62dfC322Ad014');

// getAllNFTsForContract(
//   'mumbai',
//   '0xf2b3Bc6Dc2923ebcBBb702C952c62dfC322Ad014',
//   '0x146bbc094b3e065aa6b787fe0e204a9aa3b362e3',
// );

// getAllNFTsForContract(
//   'mumbai',
//   '0xf2b3Bc6Dc2923ebcBBb702C952c62dfC322Ad014',
//   '0x146bbc094b3e065aa6b787fe0e204a9aa3b362e3',
//   [764, 109, 118],
// );

// getAllNFTsForMultipleContracts(
//   'mumbai',
//   '0xf2b3Bc6Dc2923ebcBBb702C952c62dfC322Ad014',
//   [
//     '0x146bbc094b3e065aa6b787fe0e204a9aa3b362e3',
//     '0xe25f9ce2bb2d8bd74263392685774c419e973a3a',
//     '0x4b0c9f80fd9c405eba6db25a30da0e871044fcd5',
//     '0xFcb67e6FAA7a24051D506e9072983387a6Ca6364',
//   ],
// );

/* User B */
// getAllNFTs('mumbai', '0x3DdE79c051C37547FcB0664F3e8fAD5621a7169a');

// getAllNFTsForContract(
//   'mumbai',
//   '0x3DdE79c051C37547FcB0664F3e8fAD5621a7169a',
//   '0xFcb67e6FAA7a24051D506e9072983387a6Ca6364',
// );
