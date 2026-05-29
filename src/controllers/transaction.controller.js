const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const emailService = require("../services/email.service");

// Create a new transaction 
/*
    1. Validate request
    2. Validate idempotency Key
    3. Check account status
    4. Derive sender balance from ledger
    5. Create transaction (PENDING)
    6. Create DEBIT ledger entry
    7. Create CREBIT ledger entry
    8. Mark transaction COMPLETED
    9. Commit MongoDB session
    10. Send email notification
 */

async function createTransaction(req, res) {
    // 1. Validate Request
    const {fromAccount, toAccount, amount, idempotencyKey} = req.body;
    if(!fromAccount || !toAccount || !amount || !idempotencyKey) {
        res.status(400).json({
            message: "fromAcount, toAccount, amount and idemponcyKey are required."
        })
    }
    const fromUserAccount = await accountModel.findOne({
        _id: toAccount,
    })

    if(!fromUserAcount || !toUserAccount) {
        return res.status(400).json({
            message: "INVALID sender or receiver account."
        })
    }

    // 2. Validate Idempotency Key
    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })
    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status == "COMPLETED"){
            res.staus(200).json({
                message: "Transaction already processed",
                transaction: isTransactionAlreadyExists
            })
        }
        else if(isTransactionAlreadyExists.status == "PENDING"){
            res.staus(200).json({
                message: "Transaction is stil processing",
                transaction: isTransactionAlreadyExists
            })
        }
        else if(isTransactionAlreadyExists.status == "FAILED"){
            res.staus(500).json({
                message: "Transaction failed",
                transaction: isTransactionAlreadyExists
            })
        }
        else if(isTransactionAlreadyExists.status == "REVERSED"){
            res.staus(500).json({
                message: "Transaction Reversed, Please try again",
                transaction: isTransactionAlreadyExists
            })
        }
    }
}

module.exports = createTransaction;