import { Module } from '@nestjs/common';
import { BankAccountsService } from './services/bank-accounts.service';
import { BankAccountsController } from './bank-accounts.controller';
import { ValidateBankAccountsOwnershipService } from './services/validate-bank-accounts-ownership.service';

@Module({
  controllers: [BankAccountsController],
  providers: [BankAccountsService, ValidateBankAccountsOwnershipService],
  exports: [ValidateBankAccountsOwnershipService],
})
export class BankAccountsModule {}
