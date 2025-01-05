export abstract class TemplateMapper<M, A> {
    abstract goFrom(model: M): A;
    abstract goTo(adapter: A): M;
}
