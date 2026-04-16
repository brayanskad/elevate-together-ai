import { InternalLayout } from "@/components/InternalLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockDemands } from "@/data/mockDemands";
import {
  Sparkles, Recycle, AlertTriangle, ArrowLeft, CheckCircle2,
  Calendar, Building2, Tag, Lightbulb, FileText, Settings2
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

const statusStyles: Record<string, string> = {
  "novo": "bg-info/10 text-info border-info/30",
  "em-analise": "bg-warning/15 text-warning-foreground border-warning/30",
  "encaminhado": "bg-primary/10 text-primary border-primary/30",
  "resolvido": "bg-success/15 text-success border-success/30",
};

const DemandDetail = () => {
  const { id } = useParams();
  const demand = mockDemands.find(d => d.id === id) || mockDemands[0];

  return (
    <InternalLayout
      topbarRight={
        <Button asChild variant="ghost" size="sm" className="gap-1.5">
          <Link to="/triagem-fila"><ArrowLeft className="h-4 w-4" /> Voltar à fila</Link>
        </Button>
      }
    >
      <div className="p-6 max-w-6xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">{demand.protocolo}</span>
            <Badge variant="outline" className={statusStyles[demand.status]}>
              {demand.status.replace("-", " ")}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(demand.criadoEm).toLocaleDateString("pt-BR")}
            </Badge>
            <Badge variant="outline" className="gap-1 capitalize">{demand.origem}</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary leading-tight">
            Card de Demanda — {demand.classificacao.categoria}
          </h1>
          <p className="text-muted-foreground mt-1">Encaminhada para <strong className="text-foreground">{demand.area}</strong></p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resumo IA */}
            <Card className="p-6 border-l-4 border-l-primary shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground">Resumo gerado pela IA</h2>
                  <p className="text-xs text-muted-foreground">Texto estruturado, claro e profissional</p>
                </div>
              </div>
              <p className="text-foreground leading-relaxed">{demand.resumo}</p>
            </Card>

            {/* Classificação */}
            <Card className="p-6 shadow-card">
              <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" /> Classificação automática
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <ClassRow label="Tipo de necessidade" value={demand.classificacao.tipoNecessidade} />
                <ClassRow label="Categoria" value={demand.classificacao.categoria} />
                <ClassRow label="Tipo de atuação" value={demand.classificacao.tipoAtuacao} />
                <ClassRow label="Contexto" value={demand.classificacao.contexto} />
              </div>
            </Card>

            {/* Plano de ação */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 shadow-card">
              <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" /> Plano de ação sugerido
              </h2>
              <p className="text-foreground leading-relaxed mb-4">{demand.acaoSugerida}</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Aprovar e executar
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Settings2 className="h-4 w-4" /> Customizar plano
                </Button>
              </div>
            </Card>

            {/* Reaproveitamento */}
            {demand.reaproveitamento && (
              <Card className="p-6 border-2 border-success/30 bg-success/5 shadow-card">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-success/15 flex items-center justify-center shrink-0">
                    <Recycle className="h-5 w-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-bold text-foreground">Solução semelhante já existe</h2>
                      <Badge className="bg-success text-success-foreground border-0">
                        {demand.reaproveitamento.similaridade}% match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      A IA encontrou uma solução validada que pode ser reaproveitada — economizando tempo e padronizando a resposta.
                    </p>
                    <div className="bg-card rounded-lg p-3 border border-border flex items-center justify-between">
                      <div>
                        <div className="text-xs font-mono text-muted-foreground">{demand.reaproveitamento.id}</div>
                        <div className="text-sm font-medium text-foreground">{demand.reaproveitamento.titulo}</div>
                      </div>
                      <Button size="sm" variant="outline">Reutilizar</Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {demand.alertaBoasPraticas && (
              <Card className="p-5 border-warning/40 bg-warning/5 shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-warning-foreground" />
                  <h3 className="font-bold text-foreground text-sm">Alerta de boas práticas</h3>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">{demand.alertaBoasPraticas}</p>
              </Card>
            )}

            <Card className="p-5 shadow-card">
              <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Encaminhamento
              </h3>
              <div className="space-y-3 text-sm">
                <Row label="Área responsável" value={demand.area} />
                <Row label="Origem" value={demand.origem === "interno" ? "Colaborador" : "Externo"} />
                <Row label="Status" value={demand.status.replace("-", " ")} />
                {demand.agrupamento && <Row label="Grupo" value={demand.agrupamento} />}
              </div>
            </Card>

            <Card className="p-5 shadow-card">
              <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Preferências
              </h3>
              <ul className="space-y-2 text-sm text-foreground/90">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  Prefere comunicação por e-mail
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  Não quer ser identificado(a) na equipe
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  Aceita acompanhar o progresso
                </li>
              </ul>
            </Card>
          </aside>
        </div>
      </div>
    </InternalLayout>
  );
};

const ClassRow = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-muted/40 rounded-lg p-3 border border-border">
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">{label}</div>
    <div className="text-sm font-semibold text-foreground">{value}</div>
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-2 pb-2 border-b border-border last:border-0 last:pb-0">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-foreground capitalize text-right">{value}</span>
  </div>
);

export default DemandDetail;
