import { z } from 'zod';

const assetString = z.string().min(1, 'Asset path is required');
const textString = z.string();
const subheadlineSchema = z.union([textString, z.array(textString)]);

const initialScreenSchema = z.object({
  arrowIconSrc: assetString,
  attribution: textString,
  backgroundImage: assetString,
  buttonText: textString,
  guidesImageSrc: assetString,
  headline: textString,
  logoCombinedSrc: assetString.optional(),
  quote: textString,
  subheadline: subheadlineSchema,
});

const firstScreenSchema = z.object({
  challengeLabel: textString,
  problemDescription: textString,
  savingsAmount: textString,
  savingsDescription: textString,
  subheadline: subheadlineSchema,
  videoSrc: assetString,
});

const secondScreenSchema = z.object({
  bottomDescription: textString,
  bottomVideoSrc: z.union([assetString, z.literal('')]).optional().default(''),
  largeIconSrc: assetString,
  mainDescription: textString,
  statAmount: textString,
  statDescription: textString,
  subheadline: subheadlineSchema,
  topImageSrc: assetString,
});

const thirdScreenSchema = z.object({
  description: textString,
  heroImageSrc: assetString,
  largeIconCenterSrc: assetString,
  largeIconTopSrc: assetString,
  metricAmount: textString,
  metricDescription: textString,
  metricImageSrc: assetString,
  subheadline: subheadlineSchema,
  videoSrc: assetString,
});

export const kioskChallengesSchema = z.object({
  firstScreen: firstScreenSchema,
  initialScreen: initialScreenSchema,
  secondScreen: secondScreenSchema,
  thirdScreen: thirdScreenSchema,
});

export type KioskChallenges = z.infer<typeof kioskChallengesSchema>;

const formatIssues = (issues: z.ZodIssue[]) =>
  issues
    .map((issue) => {
      const path = issue.path.join('.') || '<root>';
      return `${path}: ${issue.message}`;
    })
    .join('; ');

export const parseKioskChallenges = (value: unknown, kioskName: string): KioskChallenges => {
  const parsed = kioskChallengesSchema.safeParse(value);

  if (!parsed.success) {
    throw new Error(`Invalid challenge config for ${kioskName}: ${formatIssues(parsed.error.issues)}`);
  }

  return parsed.data;
};


