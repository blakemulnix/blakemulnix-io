import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import type { Construct } from 'constructs'

const GITHUB_OIDC_URL = 'https://token.actions.githubusercontent.com'
const GITHUB_OIDC_AUDIENCE = 'sts.amazonaws.com'

export interface GithubOidcStackProps extends cdk.StackProps {
  /** owner/repo allowed to assume the deploy role. */
  githubRepo: string
  /** Branch whose workflow runs may deploy. */
  deployBranch: string
  /**
   * Set false if the account already has a GitHub OIDC provider, since an
   * account may only hold one provider per URL.
   */
  createOidcProvider?: boolean
}

/**
 * Trusts GitHub Actions to deploy this site without any long-lived AWS access
 * keys. Workflow runs exchange their short-lived OIDC token for a session on
 * the role created here.
 *
 * Deliberately separate from SiteStack: this is account-level trust that is set
 * up once and rarely changes, and it must exist before the first CI deploy.
 */
export class GithubOidcStack extends cdk.Stack {
  public readonly deployRole: iam.Role

  constructor(scope: Construct, id: string, props: GithubOidcStackProps) {
    super(scope, id, props)

    const { githubRepo, deployBranch, createOidcProvider = true } = props

    const provider = createOidcProvider
      ? new iam.OpenIdConnectProvider(this, 'GithubOidcProvider', {
          url: GITHUB_OIDC_URL,
          clientIds: [GITHUB_OIDC_AUDIENCE],
        })
      : iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
          this,
          'GithubOidcProvider',
          `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`,
        )

    this.deployRole = new iam.Role(this, 'GithubActionsDeployRole', {
      roleName: 'github-actions-site-deploy',
      description: `Deploys ${githubRepo} from GitHub Actions`,
      maxSessionDuration: cdk.Duration.hours(1),
      assumedBy: new iam.OpenIdConnectPrincipal(provider, {
        // Pin both the audience and the exact branch. Without the `sub`
        // condition any repository on GitHub could assume this role.
        StringEquals: {
          [`token.actions.githubusercontent.com:aud`]: GITHUB_OIDC_AUDIENCE,
          [`token.actions.githubusercontent.com:sub`]: `repo:${githubRepo}:ref:refs/heads/${deployBranch}`,
        },
      }),
    })

    // Infrastructure changes go through the CDK bootstrap roles rather than
    // granting this role broad CloudFormation and IAM permissions directly.
    this.deployRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'AssumeCdkBootstrapRoles',
        actions: ['sts:AssumeRole'],
        resources: [`arn:aws:iam::${this.account}:role/cdk-*`],
      }),
    )

    new cdk.CfnOutput(this, 'DeployRoleArn', {
      value: this.deployRole.roleArn,
      description: 'Set as AWS_DEPLOY_ROLE_ARN in GitHub repository variables',
    })
  }
}
