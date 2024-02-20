export const states: string[] = [
	'B-PER',
	'I-PER',
	'B-ORG',
	'I-ORG',
	'B-LOC',
	'I-LOC',
	'B-MISC',
	'I-MISC',
	'O',
]

/**
 * Transition probabilities, stored as an n_states x n_states matrix. State indices
 * correspond to the indices of `states`.
 */
export const transitionProbabilities: number[][] = [
	[
		0.0059742647058823525, 0.65625, 0, 0, 0.00045955882352941176, 0,
		0.00015318627450980392, 0, 0.3371629901960784,
	],
	[
		0.0002277385561375541, 0.055568207697563196, 0.0004554771122751082, 0,
		0.017080391710316556, 0, 0, 0, 0.9266681849237076,
	],
	[
		0.0008118201006656925, 0, 0.005195648644260432, 0.4034745900308492,
		0.000324728040266277, 0, 0.000974184120798831, 0, 0.5892190290631596,
	],
	[
		0.0008417508417508417, 0, 0.003647586980920314, 0.3420314253647587,
		0.0002805836139169473, 0, 0.001122334455667789, 0, 0.6520763187429854,
	],
	[
		0.0010345846881466155, 0, 0.010345846881466154, 0, 0.002512562814070352,
		0.15385752290866095, 0.005025125628140704, 0, 0.8272243570795152,
	],
	[
		0.0009372071227741331, 0, 0.02999062792877226, 0, 0.0037488284910965324,
		0.10871602624179943, 0.0037488284910965324, 0, 0.8528584817244611,
	],
	[
		0.017210682492581602, 0, 0.009495548961424332, 0, 0.002373887240356083, 0,
		0.012166172106824925, 0.2545994065281899, 0.7041543026706232,
	],
	[
		0.003738317757009346, 0, 0.05046728971962617, 0, 0.001869158878504673, 0,
		0.024299065420560748, 0.2775700934579439, 0.6420560747663552,
	],
	[
		0.036991344787495155, 0, 0.03629376049605994, 0, 0.03854799121560522, 0,
		0.02063686862162511, 0, 0.8675300348792145,
	],
]

export const words: string[] = [
	'Davis',
	'St',
	'National',
	'South',
	'Bank',
	'United',
	'India',
]

/**
 * Transition probabilities, stored as an n_states x n_words matrix. State &
 * word indices correspond to the indices of `states` and `words`.
 */
export const emissionProbabilities: number[][] = [
	[
		0.0002646990702445158, 3.3087383780564474e-5, 3.3087383780564474e-5,
		3.3087383780564474e-5, 3.3087383780564474e-5, 3.3087383780564474e-5,
		3.3087383780564474e-5,
	],
	[
		0.0002131363006642748, 3.552271677737913e-5, 3.552271677737913e-5,
		3.552271677737913e-5, 3.552271677737913e-5, 3.552271677737913e-5,
		3.552271677737913e-5,
	],
	[
		3.34001336005344e-5, 0.0014696058784235137, 0.0011022044088176352,
		0.00036740146960587844, 0.00046760187040748166, 0.0008016032064128256,
		3.34001336005344e-5,
	],
	[
		3.659384491528525e-5, 0.0003659384491528525, 0.0006220953635598492,
		7.31876898305705e-5, 0.0011344091923738426, 0.0009514399677974164,
		0.00025615691440699674,
	],
	[
		3.250763929523438e-5, 0.0001625381964761719, 0.000260061114361875,
		0.002470580586437813, 3.250763929523438e-5, 0.0019829659970092973,
		0.002308042389961641,
	],
	[
		4.0355125100887815e-5, 8.071025020177563e-5, 4.0355125100887815e-5,
		8.071025020177563e-5, 0.0013317191283292978, 4.0355125100887815e-5,
		8.071025020177563e-5,
	],
	[
		0.00025868440502586844, 3.695491500369549e-5, 0.0006282335550628234,
		0.0012934220251293422, 3.695491500369549e-5, 3.695491500369549e-5,
		3.695491500369549e-5,
	],
	[
		4.035838243603196e-5, 4.035838243603196e-5, 0.00020179191218015982,
		4.035838243603196e-5, 4.035838243603196e-5, 4.035838243603196e-5,
		8.071676487206392e-5,
	],
	[
		5.416091206975925e-6, 5.416091206975925e-6, 1.6248273620927776e-5,
		5.416091206975925e-6, 1.083218241395185e-5, 5.416091206975925e-6,
		5.416091206975925e-6,
	],
]
