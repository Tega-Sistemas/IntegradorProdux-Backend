select
	c.EmpresaId empresa_ciclopcp,
	o.LoteProducaoId ordemproducao_ciclopcp,
	0 loteproducao_ciclopcp,
	c.stSetorId setor_ciclopcp,
	c.EquipamentoId postodetrabalho_ciclopcp,
	c.OperadorId responsavel_ciclopcp,
	date_format(o.OrdemProducaoDtProgramado, "%Y-%m-%d 00:00:00.000") dtprevista_ciclopcp,
	date_format(c.CEPPDtInicio, "%Y-%m-%d 00:00:00.000") dtexecucao_ciclopcp,
	0 sequencial_ciclopcp,
	e.EquipamentoNroFuncionarios qtdepessoasequipe_ciclopcp,
	CONCAT(
	    '1899-12-30 ',
	    DATE_FORMAT(min(c.CEPPDtInicio), '%H:%i:%s.'),
	    LPAD(MICROSECOND(min(c.CEPPDtInicio)) DIV 1000, 3, '0')
	) horario_inicio_ciclopcp,
	CONCAT(
	    '1899-12-30 ',
	    DATE_FORMAT(max(c.CEPPDtTermino), '%H:%i:%s.'),
	    LPAD(MICROSECOND(Max(c.CEPPDtTermino)) DIV 1000, 3, '0')
	) horario_termino_ciclopcp,
	time_format(
		sec_to_time(ROUND(timestampdiff(second, min(c.CEPPDtInicio), max(c.CEPPDtTermino)))),
		"1899-12-30 %H:%i:%s"
	) tempo_total_ciclopcp,
	time_format(sec_to_time(Round(sum(ceppminutocentesimal) * 60)), "1899-12-30 %H:%i:%s") as tempoproduzindo_ciclopcp,
	(
		select
			COALESCE(
		        CONCAT(
		            '1899-12-30 ', 
		            TIME_FORMAT(SEC_TO_TIME(ROUND(SUM(ret.ceppminutocentesimal) * 60)), '%H:%i:%s')
		        ), 
		        '1899-12-30 00:00:00'
		    ) AS tempo_retrabalho
		from cepp ret
		where ret.CEPPTipoCEPP = 'R'
		and ret.OrdemProducaoId = c.OrdemProducaoId
		and ret.EquipamentoId = c.EquipamentoId
	) temporetrabalhando_ciclopcp,
	(
		select
			COALESCE(
		        CONCAT(
		            '1899-12-30 ', 
		            TIME_FORMAT(SEC_TO_TIME(ROUND(SUM(aj.ceppminutocentesimal) * 60)), '%H:%i:%s')
		        ), 
		        '1899-12-30 00:00:00'
		    ) AS tempo_ajuste
		from cepp aj
		inner join motivoparada m on m.MotivoParadaId = aj.MotivoParadaId
		where aj.CEPPTipoCEPP = 'A'
		and m.MotivoParadaDescricao like '%SETUP%'
		and aj.OrdemProducaoId = c.OrdemProducaoId
		and aj.EquipamentoId = c.EquipamentoId
	) tempoajustemaq_ciclopcp,
	(
		select
			COALESCE(
		        CONCAT(
		            '1899-12-30 ', 
		            TIME_FORMAT(SEC_TO_TIME(ROUND(SUM(tp.ceppminutocentesimal) * 60)), '%H:%i:%s')
		        ), 
		        '1899-12-30 00:00:00'
		    ) AS tempo_parada
		from cepp tp
		inner join motivoparada m on m.MotivoParadaId = tp.MotivoParadaId
		where tp.CEPPTipoCEPP = 'A'
		and m.MotivoParadaDescricao not like '%SETUP%'
		and tp.OrdemProducaoId = c.OrdemProducaoId
		and tp.EquipamentoId = c.EquipamentoId
	) tempointerrupcoes_ciclopcp,
	'1899-12-30 00:00:00.000' tempoprevistoproducao_ciclopcp,
	'1899-12-30 00:00:00.000' tempoprevistoajuste_ciclopcp,
	'1899-12-30 00:00:00.000' tempoprevistointerrup_ciclopcp,
	42 formularateio_ciclopcp,
	"" observacoes_ciclopcp,
	now() datahorainclusao_ciclopcp,
	now() datahoraalteracao_ciclopcp,
	c.OperadorNome usuarioinclusao_ciclopcp,
	c.OperadorNome usuarioalteracao_ciclopcp
from cepp c
inner join ordemproducao o on o.OrdemProducaoId = c.OrdemProducaoId
inner join equipamento e on e.EquipamentoId = c.EquipamentoId
where c.OrdemProducaoCodReferencial <> ""
and c.CEPPTipoCEPP in ('P')
and c.CEPPSincronizado = 0
group by c.OrdemProducaoId, c.EquipamentoId, e.SetorId
order by e.SetorId, c.CEPPDtInicio
;