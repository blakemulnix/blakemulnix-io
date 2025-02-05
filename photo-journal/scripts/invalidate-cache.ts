import { CloudFront } from '@aws-sdk/client-cloudfront'
import { getStackParam } from './utils/get-stack-param';

async function invalidateCache() {
  const stage = process.env.NODE_ENV || 'test';

  try {
    // Get the distribution IDs from environment variables
    const photoDistributionId =  await getStackParam('PhotosDistributionId', stage);
    const siteDistributionId = await getStackParam('SiteDistributionId', stage)
    const region = process.env.REGION || 'us-east-1'

    if (!photoDistributionId || !siteDistributionId) {
      throw new Error('DISTRIBUTION_ID or SITE_DISTRIBUTION_ID environment variables are not set')
    }

    // Initialize CloudFront client
    const cloudFront = new CloudFront({ region })

    // Function to create and monitor invalidation
    const invalidateDistribution = async (distributionId: string) => {
      console.log(`Invalidating cache for distribution: ${distributionId} in ${region}`)

      const response = await cloudFront.createInvalidation({
        DistributionId: distributionId,
        InvalidationBatch: {
          CallerReference: new Date().getTime().toString(),
          Paths: {
            Quantity: 1,
            Items: ['/*'], // Invalidates all paths
          },
        },
      })

      const invalidationId = response.Invalidation?.Id
      if (!invalidationId) {
        throw new Error('No invalidation ID received')
      }

      console.log('Cache invalidation created:', invalidationId)
      console.log('Waiting for invalidation to complete...')
      let elapsed = 0

      while (true) {
        const status = await cloudFront.getInvalidation({
          DistributionId: distributionId,
          Id: invalidationId,
        })

        if (status.Invalidation?.Status === 'Completed') {
          console.log('\nInvalidation completed successfully!')
          break
        }

        process.stdout.write(`\rTime elapsed: ${elapsed}s`)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        elapsed += 1
      }
    }

    // Invalidate both distributions
    await Promise.all([invalidateDistribution(photoDistributionId), invalidateDistribution(siteDistributionId)])
  } catch (error) {
    console.error('Error invalidating cache:', error)
    process.exit(1)
  }
}

invalidateCache()
