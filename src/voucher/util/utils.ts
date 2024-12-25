import { BadRequestException } from "@nestjs/common";
import cryptoRandomString from "crypto-random-string";
import { VOUCHERERRORS } from "../enum/voucher-messages.enum";

export function generateRandomNumber(min: number, max: number): number {
    const randomFraction = Math.random();
    return Math.floor(randomFraction * (max - min + 1)) + min;
  }
  export function generateRandomText(length: number): string {
    if (length <= 0) {
      throw new BadRequestException(VOUCHERERRORS.LENGTH_TEXT_RANADM_ERROR);
    }
    return cryptoRandomString({ length, type: 'distinguishable' });
  }