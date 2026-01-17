import NotFoundImg from '../../assets/img/icons/not-found.svg'

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>Página no encontrada</h1>
      <section>
        <img src={NotFoundImg} alt="not found" />
      </section>
    </main>
  )
}
