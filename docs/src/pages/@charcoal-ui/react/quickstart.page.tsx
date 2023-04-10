import { ContentRoot } from '../../../components/ContentRoot'
import { StyledLink } from './ssr.page'
import { InlineCode } from '../../../components/InlineCode'
import { SSRHighlight } from '../../../components/SSRHighlight'
import Link from 'next/link'
import { getSrcFile } from './_utils/getSrcFile'
import { getStaticPropsTyped } from './_utils/getStaticPropsTyped'

type PageProps = {
  src: string
}

export default function InstallPage(props: PageProps) {
  return (
    <ContentRoot>
      <h1>@charcoal-ui/react クイックスタート</h1>
      <Link href="https://www.npmjs.com/package/@charcoal-ui/react">
        <img
          alt="npm-badge"
          src="https://img.shields.io/npm/v/@charcoal-ui/react?label=%40charcoal-ui%2Freact&style=flat-square&logo=npm"
        />
      </Link>
      <h2>インストール</h2>
      <h3>npm</h3>
      <SSRHighlight code="npm install @charcoal-ui/react" lang="shell" />
      <h3>yarn</h3>
      <SSRHighlight code="yarn add @charcoal-ui/react" lang="shell" />
      <h2>利用方法</h2>
      <p>
        <InlineCode>@charcoal-ui/styled</InlineCode>
        と合わせて使用してください。
        <InlineCode>ThemeProvider</InlineCode>,
        <InlineCode>TokenInjector</InlineCode>を使用してください。詳しくは{' '}
        <StyledLink href="/@charcoal-ui/styled/quickstart">
          @charcoal-ui/styledのクイックスタート
        </StyledLink>
        を参照してください。
      </p>
      <p>
        必要に応じて
        <InlineCode>SSRProvider</InlineCode>や
        <InlineCode>OverlayProvider</InlineCode>も使用してください。
      </p>
      <p>
        また、
        <InlineCode>ThemeProvider</InlineCode>、
        <InlineCode>TokenInjector</InlineCode>、
        <InlineCode>SSRProvider</InlineCode>、
        <InlineCode>OverlayProvider</InlineCode>を内包した
        <InlineCode>CharcoalProvider</InlineCode>を使用することもできます。
      </p>
      <SSRHighlight code={props.src} lang="typescript" />
    </ContentRoot>
  )
}

export const getStaticProps = getStaticPropsTyped<PageProps>(async () => {
  return {
    props: { src: getSrcFile('CharcoalProviderExample.tsx') },
  }
})
