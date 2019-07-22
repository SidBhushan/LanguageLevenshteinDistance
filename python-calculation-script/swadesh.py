import csv
import numpy
import levenshtein


class SwadeshComparison:
    def __init__(self, lang1: str, lang2: str):
        self.lang1 = lang1
        self.lang2 = lang2
        (self.lang1_list, lang1_interchangeables) = SwadeshComparison.create_swadesh_list(lang1)
        (self.lang2_list, lang2_interchangeables) = SwadeshComparison.create_swadesh_list(lang2)
        self.interchangeables = lang1_interchangeables + lang2_interchangeables

    def calc_levenshtein_distance(self) -> int:
        distances = []
        for key in self.lang1_list.keys():
            distances.append(levenshtein.levenshtein_distance(
                self.lang1_list[key], self.lang2_list[key],
                self.interchangeables
            ))
        return numpy.average(distances)

    @staticmethod
    def create_swadesh_list(lang: str):
        def decomment(csvfile):
            for row in csvfile:
                raw = row.split('#')[0].strip()
                if raw: yield raw

        result = {}
        interchangeables = []
        with open(f'swadesh_lists/{lang}.csv', 'r') as csv_file:
            csv_reader = csv.reader(decomment(csv_file))
            for row in csv_reader:
                if row[0] == "accept":
                    interchangeables.append((row[1], row[2], row[3]))
                else:
                    result[row[0]] = row[1]
        return result, interchangeables


if __name__ == "__main__":
    compare = SwadeshComparison("GRC", "EL")
    print(compare.interchangeables)
    print(compare.calc_levenshtein_distance())
