import type { Otp, OtpType } from "@prisma/client";

import { prisma } from "../lib/prisma";

async function createOTP(userId: string, otpType: OtpType) {
	const sampleSpace = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	let otpCode = "";

	for (let i = 0; i < 6; i++) {
		otpCode += sampleSpace.charAt(
			Math.floor(Math.random() * sampleSpace.length),
		);
	}

	const otp = await prisma.otp.create({
		data: {
			userId,
			code: otpCode,
			type: otpType,
		},
		select: {
			type: true,
			code: true,
			isUsed: true,
			user: {
				select: {
					email: true,
					role: true,
					isVerified: true,
					isDeleted: true,
					profile: {
						select: {},
					},
					createdAt: true,
					updatedAt: true,
				},
			},
			createdAt: true,
			updatedAt: true,
		},
	});

	return { otp };
}

async function verifyOTP(userId: string, otpCode: string, otpType: OtpType) {
	const otp = await prisma.otp.findFirst({
		where: {
			userId,
			code: otpCode,
			type: otpType,
			isUsed: false,
		},
	});

	if (!otp) {
		return { error: "Invalid OTP" };
	}

	await prisma.otp.update({
		where: {
			id: otp.id,
		},
		data: {
			isUsed: true,
		},
	});

	return { otp };
}

export { createOTP, verifyOTP };
