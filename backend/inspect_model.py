import joblib

model_path = "../models/random_forest.pkl"

model = joblib.load(model_path)

print("\nMODEL TYPE:")
print(type(model))

print("\nEXPECTED FEATURES:")
print(getattr(model, "n_features_in_", "Not available"))

print("\nFEATURE NAMES:")
print(getattr(model, "feature_names_in_", "Not available"))

print("\nCLASSES:")
print(getattr(model, "classes_", "Not available"))

print("\nMODEL PARAMETERS:")
print(model.get_params())