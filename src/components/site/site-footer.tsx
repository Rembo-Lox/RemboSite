import Link from 'next/link'

type SiteFooterProps = {
  copyright?: string
  domainsText?: string
  vertexpointUrl?: string
}

export const SiteFooter = ({ copyright, domainsText, vertexpointUrl }: SiteFooterProps) => (
  <footer className="site-footer">
    <p>{copyright || '(c) Rembo'}</p>
    <p>{domainsText || 'foxlol.ru | faxlol.ru'}</p>
    <p>
      <Link href={vertexpointUrl || 'https://vertexpoint.ru'} rel="noreferrer" target="_blank">
        vertexpoint.ru
      </Link>
    </p>
  </footer>
)
