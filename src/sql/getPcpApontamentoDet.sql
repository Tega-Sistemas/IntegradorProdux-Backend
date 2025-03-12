select
	0 autoinc_aptdet,
	0 ai_apont_aptdet,
	case
		when c.CEPPTipoCEPP = 'R' then 0
		when c.CEPPTipoCEPP = 'A' then 3
	end tipo_aptdet,
	c.MotivoParadaId motivo_falha_aptdet,
	c.CEPPQtdeProduzida quantidade_aptdet,
	0 setor_ocor_aptdet,
	0 valor_aptdet,
	"" observacao_aptdet,
	now() datahorainclusao_aptdet,
	now() datahoraalteracao_aptdet,
	substr(e.EquipamentoDescricao, 1, 20) usuarioinclusao_aptdet,
	'' usuarioalteracao_aptdet
from cepp c
inner join ordemproducao o on o.OrdemProducaoId = c.OrdemProducaoId
inner join equipamento e on e.EquipamentoId = c.EquipamentoId
inner join motivoparada m on m.MotivoParadaId = c.MotivoParadaId
where c.OrdemProducaoCodReferencial <> ""
and c.CEPPTipoCEPP in ('R', 'A')
and m.MotivoParadaDescricao not like '%REGULAGEM%'
-- and o.LoteProducaoId = 0 /* valores são utilizados na API para o filtro */
-- and c.OrdemProducaoId = 0 /* valores são utilizados na API para o filtro */
-- and c.EquipamentoId = 0 /* valores são utilizados na API para o filtro */
-- and c.CEPPId = 0 /* valores são utilizados na API para o filtro */
;