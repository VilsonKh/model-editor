import React from "react";
import ReactDOM from "react-dom/client";
// Определение интерфейсов для типов параметров
interface Param {
	id: number;
	name: string;
	type: "string" | "number" | "select";
	options?: string[];
}

interface ParamValue {
	paramId: number;
	value: string;
}

interface Model {
	paramValues: ParamValue[];
}

interface Props {
	params: Param[];
	model: Model;
}

interface State {
	model: Model;
}

const params: Param[] = [
  {
    id: 1,
    name: 'Назначение',
    type: 'string'
  },
  {
    id: 2,
    name: 'Длина',
    type: 'number'
  },
  {
    id: 3,
    name: 'Категория',
    type: 'select',
    options: ['Одежда', 'Электроника', 'Аксессуары']
  }
];

// Исходные значения параметров модели, которые нужно редактировать
const model: Model = {
  paramValues: [
    {
      paramId: 1,
      value: 'повседневное'
    },
    {
      paramId: 2,
      value: '42'
    },
    {
      paramId: 3,
      value: 'Одежда'
    }
  ]
};

// Компонент ParamInput, который отвечает за рендеринг и обновление отдельного параметра
class ParamInput extends React.Component<{
	param: Param;
	value: string;
	onUpdate: (paramId: number, value: string) => void;
}> {
	handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		this.props.onUpdate(this.props.param.id, event.target.value);
	};

	renderInput() {
		const { param, value } = this.props;
		switch (param.type) {
			case "number":
				return (
					<input
						type="number"
						value={value}
						onChange={this.handleChange}
					/>
				);
			case "select":
				return (
					<select
						value={value}
						onChange={this.handleChange}
					>
						{param.options?.map((option) => (
							<option
								key={option}
								value={option}
							>
								{option}
							</option>
						))}
					</select>
				);
			case "string":
			default:
				return (
					<input
						type="text"
						value={value}
						onChange={this.handleChange}
					/>
				);
		}
	}

	render() {
		return (
			<div>
				<label>
					{this.props.param.name}
					{this.renderInput()}
				</label>
			</div>
		);
	}
}

// Основной компонент редактора параметров
class ParamEditor extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			model: props.model,
		};
	}

	// Обновление значения параметра
	handleUpdate = (paramId: number, value: string) => {
		const updatedParamValues = this.state.model.paramValues.map((pv) => (pv.paramId === paramId ? { ...pv, value } : pv));
		this.setState({ model: { ...this.state.model, paramValues: updatedParamValues } });
	};

	// Получение полной структуры модели
	getModel = (): Model => {
		return this.state.model;
	};

	render() {
		const { params } = this.props;
		const { model } = this.state;

		return (
			<div>
				{params.map((param) => (
					<ParamInput
						key={param.id}
						param={param}
						value={model.paramValues.find((pv) => pv.paramId === param.id)?.value || ""}
						onUpdate={this.handleUpdate}
					/>
				))}
			</div>
		);
	}
}



const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<React.StrictMode><ParamEditor params={params} model={model}/></React.StrictMode>);
